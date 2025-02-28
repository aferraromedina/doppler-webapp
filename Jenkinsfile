pipeline {
    agent any
    stages {
        stage('Identification') {
            steps {
                sh 'echo Change request author: ${CHANGE_AUTHOR} '
            }
        }
        stage('Confirmation') {
            when {
                beforeInput true
                changeRequest author: '.*dependabot.*', comparator: "REGEXP"
            }
            steps {
                timeout(time: 180, unit: 'SECONDS') {
                    input('Continue build?')
                }
            }
        }
        stage('Restore') {
            steps {
                sh 'docker build --target restore -f Dockerfile.swarm .'
            }
        }
        stage('Test') {
            steps {
                sh 'docker build --target test -f Dockerfile.swarm .'
            }
        }
        stage('Build') {
            steps {
                sh '''docker build \\
                    --target build \\
                    --build-arg environment=production \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    -f Dockerfile.swarm \\
                    .'''
            }
        }
        stage('Release') {
            when { 
                branch 'master'
            }
            steps {
                sh 'sh generate-release-w-docker.sh'
            }
        }
        stage('Build final version images') {
            when {
                expression {
                    return isVersionTag(readCurrentTag())
                }
            }
            steps {
                // TODO: remove build differences based on environments to allow reducing the
                // number of different images. Maybe `demo` and `production` cold be enought
                sh '''docker build \
                    -t "local-doppler-webapp:production-commit-${GIT_COMMIT}" \\
                    --build-arg environment=production \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    --build-arg version=production-${TAG_NAME}+${GIT_COMMIT} \\
                    -f Dockerfile.swarm \\
                    .'''
                sh '''docker build \
                    -t "local-doppler-webapp:demo-commit-${GIT_COMMIT}" \\
                    --build-arg environment=demo \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    --build-arg version=demo-${TAG_NAME}+${GIT_COMMIT} \\
                    -f Dockerfile.swarm \\
                    .'''
                 sh '''docker build \
                    -t "local-doppler-webapp:int-commit-${GIT_COMMIT}" \\
                    --build-arg environment=int \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    --build-arg version=int-${TAG_NAME}+${GIT_COMMIT} \\
                    -f Dockerfile.swarm \\
                    .'''
                    sh '''docker build \
                    -t "local-doppler-webapp:qa-commit-${GIT_COMMIT}" \\
                    --build-arg environment=qa \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    --build-arg version=qa-${TAG_NAME}+${GIT_COMMIT} \\
                    -f Dockerfile.swarm \\
                    .'''
            }
        }
        stage('Publish final version images in dopplerdock') {
            environment {
                DOCKER_CREDENTIALS_ID = "dockerhub_dopplerdock"
                DOCKER_IMAGE_NAME = "dopplerdock/doppler-webapp"
            }
            when {
                expression {
                    return isVersionTag(readCurrentTag())
                }
            }
            steps {
                withDockerRegistry(credentialsId: "${DOCKER_CREDENTIALS_ID}", url: "") {
                    sh 'sh publish-commit-image-to-dockerhub.sh production ${DOCKER_IMAGE_NAME} ${GIT_COMMIT} ${TAG_NAME}'
                    sh 'sh publish-commit-image-to-dockerhub.sh demo ${DOCKER_IMAGE_NAME} ${GIT_COMMIT} ${TAG_NAME}'
                    sh 'sh publish-commit-image-to-dockerhub.sh int ${DOCKER_IMAGE_NAME} ${GIT_COMMIT} ${TAG_NAME}'
                    sh 'sh publish-commit-image-to-dockerhub.sh qa ${DOCKER_IMAGE_NAME} ${GIT_COMMIT} ${TAG_NAME}'
                }
            }
        }
    }
    post { 
        cleanup { 
            cleanWs()
            dir("${env.WORKSPACE}@tmp") {
                deleteDir()
            }
        }
    }
}

def boolean isVersionTag(String tag) {
    echo "checking version tag $tag"

    if (tag == null) {
        return false
    }

    // use your preferred pattern
    def tagMatcher = tag =~ /v\d+\.\d+\.\d+/

    return tagMatcher.matches()
}

// https://stackoverflow.com/questions/56030364/buildingtag-always-returns-false
// workaround https://issues.jenkins-ci.org/browse/JENKINS-55987
def String readCurrentTag() {
    return sh(returnStdout: true, script: "git describe --tags --match v?*.?*.?* --abbrev=0 --exact-match || echo ''").trim()
}
