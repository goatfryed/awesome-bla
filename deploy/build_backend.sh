docker run -it --rm --name web-engenering-build-backend \
  -v /home/lukas/workspace/awesome-bucket-list/backend:/proj \
  -w /proj \
  -u $(id -u ${USER}):$(id -g ${USER}) \
  gradle:5.4-jdk8 \
  gradle build -x test
