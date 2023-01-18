import React from 'react'
import { IconContext } from 'react-icons'
import { HiPlus, HiMinus } from 'react-icons/hi'
import { BiCurrentLocation } from 'react-icons/bi'
import './Nav.css'

export default function Nav({ viewport, setViewport }) {
    const zoom = (n) => {
        const newViewport = { ...viewport }
        newViewport.zoom += n
        setViewport(newViewport)
    }

    const handleLocation = () => {
        return null
    }
    return (
        <div className='controls'>
            <div className='location Nav'>
                <button className='zoom-button location'
                    onClick={() => { handleLocation() }}>
                    <BiCurrentLocation />
                </button>
            </div>
            <div className="Nav" style={{ display: 'flex' }}>
                <button id='plusbtn' className='zoom-button plus'
                    onClick={() => { zoom(1) }}>
                    <HiPlus />
                </button>
                <button className='zoom-button minus'
                    onClick={() => { zoom(-1) }}>
                    <HiMinus />
                </button>
            </div>
        </div>
    )
}
