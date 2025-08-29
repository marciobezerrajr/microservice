import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'
import * as docker from '@pulumi/docker-build'

const orderECRRepository = new awsx.ecr.Repository('orders-ecr', {
    forceDelete: true,
})

const ordersECRToken = aws.ecr.getAuthorizationTokenOutput({
    registryId: orderECRRepository.repository.registryId
})

export const ordersDockerImage = new docker.Image('orders-image', {
    tags: [
        pulumi.interpolate`${orderECRRepository.repository.repositoryUrl}:lastest`
    ],
    context: {
        location: '../app-orders'
    },
    push: true,
    platforms: [
        'linux/amd64'
    ],
    registries: [
        {
            address: orderECRRepository.repository.repositoryUrl,
            username: ordersECRToken.userName,
            password: ordersECRToken.password

        }
    ]
})


const cluster = new awsx.classic.ecs.Cluster('app-cluster')

const orderService = new awsx.classic.ecs.FargateService('fargatee-orders', {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinitionArgs: {
        container: {
            image: ordersDockerImage.ref,
            cpu: 256,
            memory: 512,
        }
    }
})

// import { appLoadBalancer } from './src/load-balancer'
// import { ordersService } from './src/services/orders'
// import { rabbitMQService } from './src/services/rabbitmq'
// import { kongService } from './src/services/kong'

// export const ordersId = ordersService.service.id
// export const rabbitMQId = rabbitMQService.service.id
// export const kongId = kongService.service.id
// export const rabbitMQAdminUrl = pulumi.interpolate`http://${appLoadBalancer.listeners[0].endpoint.hostname}:15672`