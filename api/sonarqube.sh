./gradlew sonar \
  -Dsonar.projectKey=test \
  -Dsonar.projectName='test' \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=$SONARQUBE_TOKEN