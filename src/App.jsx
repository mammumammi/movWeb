import { div } from 'framer-motion/client'
import React from 'react'
import Search from './components/Search'
import { useState } from 'react'
import { motion } from 'framer-motion'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');


  return (
    <main className="h-screen bg-[url('/public/BG.png')] bg-cover bg-center">
      < div  className='pattern'/>

      <div className='wrapper'>
          <header>
            <motion.img 
            src="./hero.png" alt="herobanner" 
            className="transition-transform hover:scale-120 duration-1000 hover:ease-out"
            initial={{ scale:0.8}}
            whileInView={{ scale:1.0}}
            transition={{ duration:1,
              delay:0.01, ease:"easeInOut"}}
            />
            <h1 >Find <motion.span
            viewport={{ once: true }}
            initial={{fontSize:"100%"}}
            whileInView={{fontSize:"120%"}}
            transition={{ duration:1,delay:0.1,ease:"anticipate"}}
            whileHover={{color:"#EABDE6",duration:0.5,fontSize:"145%"}}
            className="text-gradient"
             >Movies</motion.span> you'll Enjoy without hassle</h1>
          </header>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
    </main>
  )
}

export default App
