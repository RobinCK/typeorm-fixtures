export default {
    entity: 'User',
    locale: 'pl',
    processor: '/foo/boo',
    items: {
        user2: {
            firstName: '{{name.firstName}}',
            lastName: '{{name.lastName}}',
            email: '{{internet.email}}',
        },
    },
};
