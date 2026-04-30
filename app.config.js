const appJson = require('./app.json')

export default {
    expo: {
        ...appJson.expo,
        extra: {
            ...(appJson.expo?.extra || {}),
            posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
            posthogHost: process.env.POSTHOG_HOST,
            eas: {
                ...(appJson.expo?.extra?.eas || {}),
                projectId: "2880ed94-47a9-4ba6-ab44-4d72ee8df8e8"
            }
        },
    },
}
