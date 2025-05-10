import EmployeeStatusDashboard from '@/app/v1/page';

const HomePage: React.FC = () => {
    return (
        <main className='mx-auto mt-6 flex max-w-7xl flex-col justify-center gap-6 px-3 font-[family-name:var(--font-geist-sans)] sm:mt-3 sm:gap-12 sm:px-0'>
            <EmployeeStatusDashboard />
        </main>
    );
};

export default HomePage;
