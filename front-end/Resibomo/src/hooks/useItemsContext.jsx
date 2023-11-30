import { ItemsContext } from "../context/ItemContext";
import { useContext } from "react";

export const useItemsContext = () => {
    const context = useContext(ItemsContext)

    if (!context) {
        throw Error('useItemsContext must be used inside the ItemsContextProvider')
    }

    return context
}