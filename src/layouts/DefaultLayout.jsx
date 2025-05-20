import { React } from 'react'
import Navbar from './Navbar'
import Footer from './Footer';
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
    return (
        <div className="app">
            <Navbar />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}