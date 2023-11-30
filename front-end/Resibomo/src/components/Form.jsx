import { useState } from 'react'
import Receipt from './Receipt'
import { Link } from 'react-router-dom'
import { useItemsContext } from '../hooks/useItemsContext'
import { FiLogOut } from "react-icons/fi";
import { useLogut } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext'

const Form = () => {
    const { items, dispatch } = useItemsContext()
    const [ quantity, setQuantity ] = useState('')
    const [ itemName, setIteName ] = useState('')
    const [ amount, setAmount ] = useState('')
    const [ error, setError ] = useState(null)
    const [ onEditORDelete, setOnEditORDelete ] = useState(false)
    const [ selectedItem, setSelectedItem ] = useState(null)
    const [ updateItem, setUpdateItem ] = useState(false)
    const [ disableInputs, setDisableInputs ] = useState(false)
    const [ emptyFields, setEmptyFields ] = useState([])
    const { user } = useAuthContext()

    // logout function
    const { logout } = useLogut()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('Must be logged in')
            return
        }

        const item = { quantity, itemName, amount }

        const response = await fetch('http://localhost:4000/api/items', {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        
        const data = await response.json()

        if (!response.ok) {
            setError(data.error)
            setEmptyFields(data.emptyFields)
        }

        if (response.ok) {
            setQuantity('')
            setIteName('')
            setAmount('')
            setEmptyFields([])
            setError(null)
            dispatch({type: 'CREATE_ITEM', payload: data})
        }
    }

    // delete single item
    const handleDelete = async (item) => {
        if (!user) {
            return
        }

        const response = await fetch(`http://localhost:4000/api/items/${item._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const data = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_ITEM', payload: data})
        }

        setOnEditORDelete(false)
        setDisableInputs(false)
        setSelectedItem(null)
        setQuantity('')
        setIteName('')
        setAmount('')
    }

    // delete all items
    const handleDeleteAll = async () => {
        if (!user) {
            return
        }

        const response = await fetch('http://localhost:4000/api/items/', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const data = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_ALL', payload: []})
        }

        setOnEditORDelete(false)
        setSelectedItem(null)
        setUpdateItem(false)
        setDisableInputs(false)
        setQuantity('')
        setIteName('')
        setAmount('')
        setError(null)
    }

    // update single item
    const handleUpdate = async (item) => {
        if (!user) {
            return
        }

        const changedItem = { quantity, itemName, amount }

        const response = await fetch(`http://localhost:4000/api/items/${item._id}`, {
            method: 'PATCH',
            body: JSON.stringify(changedItem),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const data = await response.json()

        if (response.ok) {
            dispatch({type: 'UPDATE_ITEM', payload: {...data, ...changedItem}})
        }

        setOnEditORDelete(false)
        setSelectedItem(null)
        setUpdateItem(false)
        setDisableInputs(false)
        setQuantity('')
        setIteName('')
        setAmount('')
        setError(null)
        // fetching the data again to fix the bug in .reducer function, not adding the amount properly
        fetchItems()
    }

    const fetchItems = async () => {
        if (!user) {
            return
        }

        const response = await fetch('http://localhost:4000/api/items', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const data = await response.json()

        if (response.ok) {
            dispatch({type: 'SET_ITEMS', payload: data})
        }
    }

    // edit or delete item
    const handleEditOrDelete = (item) => {
        setOnEditORDelete(true)
        setDisableInputs(true)
        setSelectedItem(item)
        setQuantity(item.quantity)
        setIteName(item.itemName)
        setAmount(item.amount)
    }
    return (
      <>
          <div className='bg absolute z-0'></div>
          <div className='overflow-hidden sm:w-[550px] w-full mx-auto mt-14 px-2 absolute top-0 left-[0%] right-[0]'>
              <div className='bg-white sm:px-9 px-4 py-2 pb-4'>
                  <div className='flex justify-between items-center py-2 text-primary font-bold'><p>{user && user.email.split('@')[0]}</p><button className='flex items-center gap-1 hover:text-tertiary text-primary hover:bg-[#e8e9eb] rounded-sm p-1 px-2 transition-all duration-200 ease-in-out ' onClick={() => logout()}>Log out<FiLogOut /></button>
                  </div>
                  <form className='flex flex-col pb-3 border-b-[1px] border-secondary' onSubmit={handleSubmit}>
                      <div className='flex justify-between items-center'>
                          <Link to='/'><h1 className='font-sans sm:text-[47px] text-[40px] font-bold text-primary tracking-tighter'>resibomo</h1></Link>   
                          <button name='btnDeleteAll' type='button' className='rounded-md bg-tertiary font-primary text-[14px] text-white p-2 w-[100px] hover:bg-white hover:text-tertiary hover:border-tertiary border-tertiary border-[1px] transition-all duration-500 ease-out' onClick={handleDeleteAll}>Void</button>
                      </div>
                      <div className='flex flex-col gap-2 py-1'>
                          <input disabled={disableInputs} type="text" name='itemName' required placeholder='Enter item' autoComplete='off' className={`rounded-md border-[1px] ${disableInputs ? '' :'hover:border-tertiary'} focus:border-tertiary outline-none font-sans text-[14px] p-2 w-full ${emptyFields.includes('itemName') ? 'border-[#f1aeb5]' : 'border-secondary'}`} onChange={(e) => {
                            setIteName(e.target.value)
                          }} value={itemName}/>
                          <div className='flex gap-2 pb-4'>
                              <input disabled={disableInputs} type="number" name='quantity' required placeholder='Enter quantity' min={1} className={`rounded-md border-[1px] ${disableInputs ? '' :'hover:border-tertiary'} focus:border-tertiary outline-none  font-sans text-[14px] p-2 w-full ${emptyFields.includes('quantity') ? 'border-[#f1aeb5]' : 'border-secondary'}`} onChange={(e) => {
                                    setQuantity(e.target.value)
                                }} value={quantity}/>
                              <input disabled={disableInputs} type="number" name='amount' required placeholder='Enter amount' min={1} className={`rounded-md border-[1px] ${disableInputs ? '' :'hover:border-tertiary'} focus:border-tertiary outline-none  font-sans text-[14px] p-2 w-full ${emptyFields.includes('amount') ? 'border-[#f1aeb5]' : 'border-secondary'}`} onChange={(e) => {
                                    setAmount(e.target.value)
                                }} value={amount}/>
                          </div>
                          {!onEditORDelete ? <button type='submit' className='rounded-md bg-black font-primary text-[14px] text-white p-2 w-full hover:bg-white hover:text-black hover:border-black border-black border-[1px] transition-all duration-500 ease-out'>Add Item</button> :
                          <div className='flex flex-col gap-2'>
                            <div className={updateItem ? 'hidden' : 'flex gap-2'}>
                                <button name='btnUpdate' type='button' className='rounded-md bg-[#198754] font-primary text-[14px] text-white p-2 w-full hover:bg-[#2C632C] border-[#198754] border-[1px] transition-all duration-500 ease-out' onClick={() => {setUpdateItem(true)
                                 setDisableInputs(false)   
                                }}>Update Item</button>
                                <button name='btnDelete' type='button' className='rounded-md bg-[#dc3545] font-primary text-[14px] text-white p-2 w-full hover:bg-[#A72925] border-[#dc3545] border-[1px] transition-all duration-500 ease-out' onClick={() => handleDelete(selectedItem)}>Delete Item</button>
                            </div>
                            <button name='btnSaveChanges' type='button' className={`rounded-md bg-[#198754] font-primary text-[14px] text-white p-2 w-full hover:bg-[#2C632C] border-[#198754] border-[1px] transition-all duration-500 ease-out ${updateItem ? 'static' : 'hidden'}`} onClick={() => handleUpdate(selectedItem)}>Save Changes</button>
                            <button name='btnCancel' type='button' className='rounded-md bg-black font-primary text-[14px] text-white p-2 w-full hover:bg-white hover:text-black hover:border-black border-black border-[1px] transition-all duration-500 ease-out' onClick={() => {
                                setOnEditORDelete(false)
                                setSelectedItem(null)
                                setUpdateItem(false)
                                setDisableInputs(false)
                                setQuantity('')
                                setIteName('')
                                setAmount('')
                            }}>Cancel</button>
                          </div>}
                          {error && <div className='w-full p-2 rounded-md bg-[#f8d7da] border-[1px] border-[#f1aeb5] text-[#58151c] text-sm'>{error}</div>}
                      </div> 
                  </form>
                  <Receipt editORDelete={handleEditOrDelete} onChanging={onEditORDelete} />
              </div>
          </div>
      </>
    )
  }
  
  export default Form