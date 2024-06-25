import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en_url from "@locales/en/url.json"
import en_sidebar from "@locales/en/sidebar.json"
import en_common from "@locales/en/common.json"
import en_search from "@locales/en/search.json"
import en_input from "@locales/en/input.json"
import en_dialog from "@locales/en/dialog.json"
import en_todo from "@locales/en/todo.json"
import en_table from "@locales/en/table.json"
import en_validation from "@locales/en/validation.json"
import en_error from "@locales/en/error.json"

import zh_tw_url from "@locales/zh_tw/url.json"
import zh_tw_sidebar from "@locales/zh_tw/sidebar.json"
import zh_tw_common from "@locales/zh_tw/common.json"
import zh_tw_search from "@locales/zh_tw/search.json"
import zh_tw_input from "@locales/zh_tw/input.json"
import zh_tw_dialog from "@locales/zh_tw/dialog.json"
import zh_tw_todo from "@locales/zh_tw/todo.json"
import zh_tw_table from "@locales/zh_tw/table.json"
import zh_tw_validation from "@locales/zh_tw/validation.json"
import zh_tw_error from "@locales/zh_tw/error.json"

const resources = {
  en: {
    url: en_url,
    sidebar: en_sidebar,
    common: en_common,
    search: en_search,
    input: en_input,
    dialog: en_dialog,
    todo: en_todo,
    table: en_table,
    validation: en_validation,
    error: en_error,
  },
  zh_tw: {
    url: zh_tw_url,
    sidebar: zh_tw_sidebar,
    common: zh_tw_common,
    search: zh_tw_search,
    input: zh_tw_input,
    dialog: zh_tw_dialog,
    todo: zh_tw_todo,
    table: zh_tw_table,
    validation: zh_tw_validation,
    error: zh_tw_error,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("locale") || "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
