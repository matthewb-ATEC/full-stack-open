import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState: 'test notification',
    reducers: {}
})

export default notificationSlice.reducer