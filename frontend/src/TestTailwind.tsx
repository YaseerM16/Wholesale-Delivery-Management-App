const TestTailwind = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

                <form className="space-y-4">

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"

                            placeholder="you@example.com"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500`}
                        />
                        {/* {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>} */}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"

                            placeholder="Password"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500`}
                        />
                        {/* {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>} */}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        Login
                    </button>
                    <a href="/signup">
                        <button
                            type="button"
                            className="w-full mt-4 py-2 px-4 bg-gray-600 text-white font-semibold rounded-md shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            signup for new account
                        </button>
                    </a>
                </form>
            </div>
        </div>

    );
};

export default TestTailwind;
