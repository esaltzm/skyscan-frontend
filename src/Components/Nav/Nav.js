import React from 'react'
import { IconContext } from 'react-icons'
import { toast } from 'react-toastify'
import { HiPlus, HiMinus } from 'react-icons/hi'
import { BiCurrentLocation } from 'react-icons/bi'
import './Nav.css'

export default function Nav({ viewport, setViewport, setLoading }) {
    const zoom = (n) => {
        setLoading(true)
        const newViewport = { ...viewport }
        newViewport.zoom += n
        setViewport(newViewport)
    }

    const handleLocation = () => {
        setLoading(true)
        if (!navigator.geolocation) {
            toast.warn('Geolocation is not supported by your browser')
            setLoading(false)
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                if (position) {
                    const [lat, lng] = [position.coords.latitude, position.coords.longitude]
                    const newViewport = { ...viewport }
                    newViewport.zoom = 7
                    newViewport.latitude = lat
                    newViewport.longitude = lng
                    setViewport(newViewport)
                }
            }, () => {
                toast.warn('Unable to retrieve your location')
                setLoading(false)
            })
        }
    }

    return (
        <div className='controls'>
            <div className='location Nav'>
                <button className='zoom-button location'
                    onClick={() => { handleLocation() }}>
                    <div className='location-img'><img src='location.png' className='button-img' style={{ height: '18px' }} /></div>
                </button>
            </div>
            <div className="plusminus Nav" style={{ display: 'flex' }}>
                <button id='plusbtn' className='zoom-button plus'
                    onClick={() => { zoom(1) }}>
                    <div><img src='plus.png' className='button-img' /></div>
                </button>
                <button className='zoom-button minus'
                    onClick={() => { zoom(-1) }}>
                    <div><img src='minus.png' className='button-img' /></div>
                </button>
            </div>
        </div>
    )
}
