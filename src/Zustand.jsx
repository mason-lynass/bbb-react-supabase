import { create } from 'zustand'

export const globalStore = create((set) => ({
    session: null,
    setSession: (session) => set(() => ({session})),
    profile: null,
    setProfile: (profile) => set(() => ({profile})),
    users: [],
    setUsers: (users) => set(() => ({users})),
    bathrooms: [],
    setBathrooms: (bathrooms) => set(() => ({bathrooms})),
    reviews: [],
    setReviews: (reviews) => set(() => ({reviews})),
    favorites: [],
    setFavorites: (favorites) => set(() => ({favorites}))
}))

// const createSessionStore = (set) => ({
//     session: null,
// })

// const createUsersStore = (set) => ({
//     users: [],
// })

// const createBathroomsStore = (set) => ({
//     bathrooms: [],
// })

// const createReviewsStore = (set) => ({
//     reviews: [],
// })

// const createFavoritesStore = (set) => ({
//     favorites: [],
// })

// export const globalStore = create((...a) => ({
//     ...createSessionStore(...a),
//     ...createUsersStore(...a),
//     ...createReviewsStore(...a),
//     ...createBathroomsStore(...a),
//     ...createFavoritesStore(...a)
// }))