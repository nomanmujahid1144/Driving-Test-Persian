import React from 'react'
import ReactDom from 'react-dom'
import cross from '../../assets/cross.svg'


export const Modal = ({ open, onClose, children }) => {
    if (!open) return null

    return ReactDom.createPortal(
        <>
            <div className='fixed top-0 bottom-0 left-0 right-0 bg-black opacity-60 z-50' />
            <div className=' fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white z-50 shaddow-lg rounded w-[70%] lg:w-[80%] md:w-[90%] sm:w-[95%]  overflow-hidden md:overflow-y-scroll'>
                <div className='relative'>
                    <button className='absolute top-0 right-3  rounded p-2' onClick={onClose}><img className='w-4' src={cross} alt='cross' /></button>
                </div>
                {children}
            </div>
        </>,
        document.getElementById('portal')
    )
}