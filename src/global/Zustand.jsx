import { create } from 'zustand'

export const globalStore = create((set) => ({
    session: null,
    setSessiony: (input) => set(() => ({session: input})),
    profile: null,
    setProfile: (input) => set(() => ({profile: input})),
    users: [],
    setUsers: (input) => set(() => ({users: input})),
    bathrooms: [],
    setBathrooms: (input) => set(() => ({bathrooms: input})),
    reviews: [],
    setReviews: (input) => set(() => ({reviews: input})),
    favorites: [],
    setFavorites: (input) => set(() => ({favorites: input}))
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