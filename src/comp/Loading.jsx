import React from 'react'

export const Loading = () => {
    return (
        <>
            <div className='mainLoadingScreen'>
                <div className="flexCol">
                    <img className='loadingLogo' src='https://raw.githubusercontent.com/Flare-0/noteable/main/public/logo.svg'/>
                    <div className='spinny'></div>


                    <div className="pBarCont"><div className="pbar"></div></div>
                </div>
            </div>
        </>
    )
}
