export const useActiveMenu = defineStore('activeMenu', () => {
  const activeMenu = ref('tablon')

  function setActiveMenu(menu: string) {
    activeMenu.value = menu
  }

  return {
    activeMenu,
    setActiveMenu
  }
})