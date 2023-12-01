import * as htmlToImage from 'html-to-image';
import downloadjs from "downloadjs";
import { BiSolidDownload } from 'react-icons/bi'
import { useEffect, useState } from 'react';
import { useItemsContext } from '../hooks/useItemsContext';
import { useAuthContext } from '../hooks/useAuthContext'

const Receipt = ({ editORDelete, onChanging }) => {
  const { items, dispatch } = useItemsContext()
  const [ editItem, setEditItem ] = useState(null)
  const [ filterValue, setFilterValue ] = useState('')
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchItems = async () => {
        const response = await fetch('https://resibomo-api.vercel.app/api/items', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const data = await response.json()

        if (response.ok) {
            dispatch({type: 'SET_ITEMS', payload: data})
        }
    }

    if (user) {
        fetchItems()
    }
  }, [dispatch, user])

//   download receipt
  const handleClick = () => {htmlToImage.toPng(document.getElementById('receipt'))
    .then(function (dataUrl) {
    downloadjs(dataUrl, 'my-receipt.png')})}

//   to add comma in numbers
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

// scroll to the top of the document
  const goTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  return (
    <div>
        {!items || items.length === 0 ? null : <div className='flex flex-col'>
            <div className='flex items-center justify-center py-4 gap-4'>
                <input disabled={onChanging} type="text" name='filter' placeholder='Filter items (enter an item)' autoComplete='off' className={`rounded-md border-[1px] border-secondary ${ onChanging || filterValue !== '' ? '' :'hover:border-tertiary' } focus:border-tertiary outline-none font-sans text-[14px] p-2 w-full`} onChange={(e) => setFilterValue(e.target.value)}/>
                <button disabled={onChanging || filterValue !== ''} className={`rounded-md bg-white font-primary text-[21px] p-2 ${onChanging || filterValue !== '' ? 'text-secondary border-secondary' : 'text-tertiary hover:bg-tertiary hover:text-white hover:border-tertiary border-tertiary'} border-[1px] transition-all duration-500 ease-out`} download onClick={handleClick}><BiSolidDownload /></button>
            </div>
            <div id="receipt" className='overflow-hidden flex flex-col items-start sm:px-9 px-4 [word-spacing:5px] tracking-tighter leading-7 text-primary sm:text-[16px] text-[14px]'>
                <h1 className='text-primary font-primary font-bold sm:text-[50px] text-[43px] py-14 self-center'>RESIBOMO</h1>
                <p>ORDER #0001 FOR {user && user.email.split('@')[0].toUpperCase()}</p>
                <p className='leading-5'>FROM: {items ? ((new Date(items && items[items.length-1].createdAt)).toString().slice(0, 15)).toUpperCase() : '-'}</p>
                <p>TO: {items ? ((new Date(items && items[0].createdAt)).toString().slice(0, 15)).toUpperCase() : '-'}</p>
                <table className='w-full table-auto'>
                    <thead>
                        <tr className='border-y-[1px] border-dashed border-primary break-all'>
                            <td className='text-start w-[55px]'>QTY</td>
                            <td className='text-start w-[300px]'>ITEM</td>
                            <td className='text-end w-[100px]'>AMT</td>
                        </tr>
                    </thead>
                    <tbody>
                        {items.filter((item) => item.itemName.toLowerCase().includes(filterValue.toLowerCase().trim())).length !== 0 ? items.filter((item) => item.itemName.toLowerCase().includes(filterValue.toLowerCase().trim())).map((item, index) => (
                            <tr key={index} className={`break-all cursor-pointer hover:text-tertiary leading-6 ${item._id === editItem && onChanging ? 'text-tertiary' : ''}`} onClick={() => {editORDelete(item)
                                setEditItem(item._id)
                                goTop()
                            }}>
                                <td>{item.quantity}</td>
                                <td className='overflow-hidden break-all'>{(item.itemName).toUpperCase()}</td>
                                <td className='text-end'>{numberWithCommas(item.amount)}</td>
                            </tr>
                            )) : 
                            <tr className='break-all'>
                                <td>-</td>
                                <td className='overflow-hidden break-all'>NO ITEM FOUND</td>
                                <td className='text-end'>-</td>
                            </tr>
                        }
                    </tbody>
                </table>
                <div className='w-full border-y-[1px] border-dashed border-primary'>
                    <p className='flex justify-between'>ITEM COUNT:<span>{items ? items.length : '-'}</span></p>
                    <p className='flex justify-between'>TOTAL:<span>{items ? numberWithCommas(items.map((item) => item.amount).reduce((acc, cur) => acc + cur, 0)) : '-'}</span></p>
                </div>
                <p>CARD #: **** **** **** {new Date().getFullYear()}</p>
                <p>AUTH CODE: 123456</p>
                <p>CARDHOLDER: {user && user.email.split('@')[0].toUpperCase()}</p>
                <div className='flex flex-col items-center justify-center py-8 font-medium text-primary text-center'>
                    <p>THANK YOU FOR VISITING!</p>
                    <img src="src/assets/image/barcode.png" alt="barcode" />
                    <p className='tracking-widest'>resibomo.vercel.app</p>
                </div>
            </div>
        </div>}
    </div>
  )
}

export default Receipt;