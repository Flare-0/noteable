import React from 'react'

export const Loading = () => {
    return (
        <>
            <div className='mainLoadingScreen'>
                <div className="flexCol">
                    <img className='loadingLogo' src='/public/logo.svg'/>
                    <div className='spinny'></div>


                    <div className="pBarCont"><div className="pbar"></div></div>
                </div>
            </div>
        </>
    )
}
