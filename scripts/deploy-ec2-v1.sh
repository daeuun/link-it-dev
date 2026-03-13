#!/bin/bash

# 현재 실행 중인 포트 확인
if [ -f /etc/nginx/conf.d/service-url.inc ]; then
set $upstream_port 3000; 라고 되어잇다
    CURRENT_PORT=$(grep -oP 'upstream_port \K\d+' /etc/nginx/conf.d/service-url.inc)
else
    CURRENT_PORT=3001
fi

# 대상 포트 변경
if [ "${CURRENT_PORT:-0}" -eq 3000 ]; then
  TARGET_PORT=3001
else
  TARGET_PORT=3000
fi

if [ -z "$TARGET_PORT" ]; then
  echo "  ❌ Error: TARGET_PORT is not set!"
  exit 1
fi

echo "  ✅ Server port: '$CURRENT_PORT' -> '$TARGET_PORT'"

# 타겟 포트의 프로세스 종료
pm2 delete "app-$TARGET_PORT" || true

# 새로운 포트로 PM2 신규 프로세스 run
PORT=$TARGET_PORT pm2 start ecosystem.config.js --name "app-$TARGET_PORT"

# 신규 프로세스 정상 가동 확인
max_retry=10
for retrys in `seq 2 $max_retry`
do
  echo "  🔍 Health checking on ${TARGET_PORT}..."
  sleep 3
  health_response=$(curl -s "localhost:${TARGET_PORT}/health")
  health_up=$(echo "${health_response}" | grep '"status":"ok"')
  if [ -n "$health_up" ]; then
    echo "  ✅ New server is ready"
    break
  else
    echo "  ❌ unhealthy state: ${health_response} ... (${retrys}/${max_retry})"
  fi
  if [ ${retrys} -eq $max_retry ]; then
    echo "  ❌ Health check failed"
    pm2 delete "app-$TARGET_PORT"
    exit 1
  fi
done

# nginx 리버스프록시 포트 전환
echo "set \$upstream_port ${TARGET_PORT};" | sudo tee /etc/nginx/conf.d/service-url.inc
sudo service nginx reload

# 기존 프로세스 종료
if [ -n "$CURRENT_PORT" ] && [ "$CURRENT_PORT" != "$TARGET_PORT" ]; then
  sudo pm2 delete "app-$CURRENT_PORT" || true
fi
echo "  ✨ Deployment Completed!"
