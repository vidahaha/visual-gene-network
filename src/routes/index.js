import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Toper from "@/components/Toper/Toper"


import Index from '@/views/Index/Index';
import Demo from '@/views/Demo/Demo';
import Network from '@/views/Network/Network';
import Contact from '@/views/Contact/Contact';

const routes = (
    <BrowserRouter>
        <div>
			<Toper></Toper>
            <Route exact path="/" component={Index} />    
            <Route path="/index" component={Index} />        
            <Route path="/network" component={Network} />
            <Route path="/demo" component={Demo} />
            <Route path="/contact" component={Contact} />
            <footer className="footer">
                Copyright © 2018Institute of Genetics and Developmental Biology, Chinese Academy of Sciecnces
            </footer>
        </div>
    </BrowserRouter>
);

export default routes;