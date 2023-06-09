#!/bin/bash

set -x
set -e

# 显示当前 ENV 变量
DOCKER_COMMAND='docker run -it --entrypoint "bash" '
for item in $(env); do
  DOCKER_COMMAND+="-e ${item} "
done
DOCKER_COMMAND+="IMAGE_ID"
echo "Docker Command: ${DOCKER_COMMAND}"


# 渲染配置文件
ENV_ARG=$(awk 'BEGIN{for(v in ENVIRON) printf "${%s} ", v;}')
envsubst "${ENV_ARG}" </app/deploy-config/nginx.conf.http.tpl >/etc/nginx/nginx.conf
envsubst "${ENV_ARG}" </app/deploy-config/config.js.tpl >/app/config.js

# 启动 nginx
mkdir -p /run/nginx
exec nginx
