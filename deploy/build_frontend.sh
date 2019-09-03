docker run -it --rm --name web-engenering-build-frontend \
  -v ${PWD}/../frontend:/proj \
  -w /proj \
  node:8.16	 \
  bash -c 'npm install && npm run build'
