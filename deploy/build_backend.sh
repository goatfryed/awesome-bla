docker run -it --rm --name web-engenering-build-backend \
  -v /home/lukas/workspace/awesome-bucket-list/backend:/proj \
  -w /proj \
  gradle:5.4-jdk8 \
  gradle build -x test
