import { type PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "app/createAppSlice"

export interface CommonSliceState {
  displaySideBar: boolean
  content?: any
  open: boolean
  resolve?: () => void
  reject?: () => void
}

const initialState: CommonSliceState = {
  displaySideBar: true,
  open: false,
}
interface ConfirmationPayload {
  title?: string
  content?: any
  confirmLabel?: string
  cancelLabel?: string
  resolve?: () => void
  reject?: () => void
}

export const commonSlice = createAppSlice({
  name: "common",
  initialState,
  reducers: create => ({
    handleSideBarDisplay: create.reducer(state => {
      state.displaySideBar = !state.displaySideBar
    }),
    handleConfirmation: create.reducer(
      (state, action: PayloadAction<ConfirmationPayload>) => {
        let { title, content, confirmLabel, cancelLabel } = action.payload
        state.content = { title, content, confirmLabel, cancelLabel }
        state.open = true
        state.resolve = action.payload.resolve
        state.reject = action.payload.reject
      },
    ),
    setConfirmation: create.reducer(state => {
      state.open = !state.open
    }),
    closeConfirmation: create.reducer(state => {
      state.open = false
    }),
    clearConfirmation: create.reducer(state => {
      state.content = {}
      state.open = false
      state.reject = () => {}
      state.resolve = () => {}
    }),
  }),
  selectors: {
    selectDisplaySideBar: common => common.displaySideBar,
    selectConfirmation: common => common,
  },
})

export const {
  handleSideBarDisplay,
  handleConfirmation,
  setConfirmation,
  closeConfirmation,
  clearConfirmation,
} = commonSlice.actions

export const { selectDisplaySideBar, selectConfirmation } =
  commonSlice.selectors
