import type { PropsType } from "../utils/types";

const Layout = ({ children }: PropsType) => {
    return (
        <div className="min-h-screen">
            <main className='max-w-12xl mx-auto mt-16 bg-cream'>{children}</main>
        </div>
    );
};

export default Layout;