docker run -it --rm --name web-engenering-build-frontend \
  -v /home/lukas/workspace/awesome-bucket-list/frontend:/proj \
  -w /proj \
  -u $(id -u ${USER}):$(id -g ${USER}) \
  node:8.16	 \
  bash -c 'npm install && npm run build'
