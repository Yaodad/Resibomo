import { useAuthContext } from "./useAuthContext";
import { useItemsContext } from "./useItemsContext";

export const useLogut = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: itemsDispatch } = useItemsContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch locout action
        dispatch({type: 'LOGOUT'})
        itemsDispatch({type: 'SET_ITEMS', payload: null})
    }

    return { logout }
}