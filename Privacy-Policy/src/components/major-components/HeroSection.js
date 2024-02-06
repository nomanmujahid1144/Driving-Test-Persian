import React from 'react'
import BottomImage from '../../assets/background.jpg'


export const HeroSection = () => {

    return (
        <>
            <div style={{ backgroundImage: `url(${BottomImage})` }} className="w-[100%] opacity-55 h-auto  bg-no-repeat bg-center  bg-cover px-10  flex  items-center gap-4">
                <div className='w-100 h-auto  rounded flex flex-col justify-center text-center'>
                <section className="relative md:py-24 py-16 text-left">
                    <div className="container relative">
                        <div className="md:flex justify-center">
                        <div className="md:w-3/4">
                                    <div className="p-6 bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 rounded-md">
                                        <h5 className="text-xl font-bold mb-4 text-center">Privacy Statement</h5>
                            <p className="text-slate-400">
                                At Theory Test in Persian, we value your privacy and are committed to protecting your personal information. This Privacy Statement explains how we collect, use, and safeguard your device ID data to ensure a seamless experience for you.
                            </p>
                            <h2 className="text-lg font-semibold mb-0 mt-8">
                                Information We Collect:
                            </h2>
                            <ul className="list-none text-slate-400 mt-1">
                                <li className="flex mt-2">
                                <i className="uil uil-arrow-right text-indigo-600 text-lg align-middle me-2" />
                                    When you install and use our app, we collect your unique device identifier (Device ID). This identifier helps us recognize your device and save your progress securely, ensuring that you can resume where you left off if you reinstall the app.
                                </li>
                            </ul>
                            <h5 className="text-lg font-semibold mb-2 mt-4">
                                How We Use Your Device ID:
                            </h5>
                            <p className="text-slate-400">
                                We use your Device ID solely for the purpose of providing you with a personalized experience within our app. It enables us to save your progress and display it back to you if you decide to reinstall the app. Remember! Device ID without no further context is of no use.
                            </p>
                            <h5 className="text-lg font-semibold mb-2 mt-4">
                                Data Security:
                            </h5>
                            <p className="text-slate-400">
                                We take data security seriously and have implemented appropriate measures to protect your Device ID from unauthorized access, loss, or misuse.
                            </p>
                            <h5 className="text-lg font-semibold mb-2 mt-4">
                                Sharing Your Information:
                            </h5>
                            <p className="text-slate-400">
                            We do not share your Device ID with any third parties. It is used exclusively within our app to enhance your user experience.
                            </p>
                            <h5 className="text-lg font-semibold mb-2 mt-4">
                                Retention Period:
                            </h5>
                            <p className="text-slate-400">
                                We retain your Device ID for as long as necessary to fulfill the purposes outlined in this Privacy Statement. If you wish to have your data deleted, please contact us at <a href='theorytestinpersian.co.uk' target='_black'>theorytestinpersian.co.uk</a>.
                            </p>
                            <h5 className="text-lg font-semibold mb-2 mt-4">
                                Children’s Privacy:
                            </h5>
                            <p className="text-slate-400">
                                Our app is not intended for children under the age of 13. We do not knowingly collect any personal information from children.
                            </p>
                            <h5 className="text-lg font-semibold mb-2 mt-4">
                                Changes to this Privacy Statement:
                            </h5>
                            <p className="text-slate-400">
                                We may update this Privacy Statement from time to time. Any changes will be posted within the app, and your continued use of the app after the changes are made will indicate your acceptance of the updated Privacy Statement.
                            </p>
                            <h5 className="text-lg font-semibold mb-2 mt-4">
                                Contact Us:
                            </h5>
                            <p className="text-slate-400">
                                If you have any questions or concerns about our privacy practices or wish to exercise your rights regarding your data, please contact us at <a href='theorytestinpersian.co.uk' target='_black'>theorytestinpersian.co.uk</a>.
                            </p>
                            <p className="text-slate-400">
                            By using our app, you agree to the terms outlined in this Privacy Statement. Thank you for trusting Theory Test in Persian with your personal information. We strive to provide you with an enjoyable and secure experience.
                            </p>
                            </div>
                        </div>
                        {/*end */}
                        </div>
                        {/*end grid*/}
                    </div>
                    {/*end container*/}
                </section>
                </div>
            </div>
        </>
    )
}
