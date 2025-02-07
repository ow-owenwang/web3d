import {createRouter, createWebHistory} from "vue-router";

const modules = import.meta.glob('../views/**/*.vue');
console.log(modules);

const dynamicRoutes = Object.keys(modules).map((path) => {
    // const name = path.match(/\/a\/(.+?)\.vue$/)[1];
    console.log(path.split('/views/')[1].split('/'))
    const fragments = path.split('/views/')[1].split('/')
    if (fragments.length === 1) {
        return {
            path: encodeURI(`/${fragments[0].split('\.')[0]}`),
            component: modules[path]
        }
    } else {
        const somePath = fragments.slice(0, -1).join('/')
        return {
            path: encodeURI(`/${somePath}/${fragments.slice(-1)[0].split('\.').slice(0, -1).join('\.')}`),
            component: modules[path]
        }
    }
});

console.log(dynamicRoutes);

const routes = [
    {
        path: '/',
        component: () => import('../views/Home.vue'),
    },
    ...dynamicRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export {routes}
export default router