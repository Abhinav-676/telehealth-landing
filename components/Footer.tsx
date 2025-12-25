export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-sm">
                                <i className="fa-solid fa-heart-pulse"></i>
                            </div>
                            <span className="font-bold text-lg text-gray-900">TeleHealth<span className="text-brand-600">Pro</span></span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">Secure • Reliable • AI-Powered Healthcare.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-brand-600 transition">Features</a></li>
                            <li><a href="#" className="hover:text-brand-600 transition">Pricing</a></li>
                            <li><a href="#" className="hover:text-brand-600 transition">For Doctors</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-brand-600 transition">About Us</a></li>
                            <li><a href="#" className="hover:text-brand-600 transition">Careers</a></li>
                            <li><a href="#" className="hover:text-brand-600 transition">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-brand-600 transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-brand-600 transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-brand-600 transition">HIPAA Compliance</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">© 2025 Telehealth Platform. All Rights Reserved.</p>
                    <div className="flex gap-4 text-gray-400">
                        <a href="#" className="hover:text-brand-600 transition"><i className="fa-brands fa-twitter"></i></a>
                        <a href="#" className="hover:text-brand-600 transition"><i className="fa-brands fa-linkedin"></i></a>
                        <a href="#" className="hover:text-brand-600 transition"><i className="fa-brands fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
