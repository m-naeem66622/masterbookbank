import React from 'react'

function Page404() {
  const pTagStyle = {
    fontSize: "1.5rem"
  }

  const h1TagStyle = {
    fontSize: "5rem"
  }

  // const ulTagStyle = {
  //   fontSize: "1.2rem"
  // }
  return (
    <div className='text-light my-5 mx-auto text-center d-flex flex-column justfy-content-center h-100'>
      <h1 style={h1TagStyle}>404</h1>
      <p style={pTagStyle}>Page not found</p>
      <p style={pTagStyle}>Sorry, we couldn't find what you were looking for.</p>
      <p style={pTagStyle}>Here are some statistics to cheer you up:</p>
      {/* <ul style={ulTagStyle} className='list-unstyled'>
        <li>There are over 1.8 billion websites on the internet.</li>
        <li>The average human attention span is 8 seconds.</li>
        <li>The most searched term on Google is "Facebook".</li>
      </ul> */}
    </div>
  )
}

export default Page404