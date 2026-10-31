const { User } = require('./models');

const officersData = [
    { name: 'Dharmveer Singh', rank: 'Superintendent of Police (SP)' },
    { name: 'Dr. Shivesh Singh Baghel', rank: 'Additional SP (City East)' },
    { name: 'Sujawal Jagga', rank: 'Additional SP (City Central/Traffic)' },
    { name: 'Suman Gurjar', rank: 'Additional SP (City West/Crime)' },
    { name: 'Jayraj Kuber', rank: 'Additional SP (Rural)' },
    { name: 'Nagendra Singh Sikarwar', rank: 'CSP Maharajpura' },
    { name: 'Sandeep Bangre', rank: 'CSP University' },
    { name: 'Krishna Pal Singh', rank: 'CSP Gwalior' },
    { name: 'Kiran Ahirwar', rank: 'CSP Lashkar' },
    { name: 'Manish Yadav', rank: 'SDOP Behat' },
    { name: 'Shikha Soni', rank: 'DSP Women Crime' },
    { name: 'Vijay Singh Tomar', rank: 'DSP (AJAK)' },
    { name: 'Ajit Singh Chauhan', rank: 'DSP Traffic' },
    { name: 'Shailendra Sharma', rank: 'DSP Rural' },
    { name: 'Robin Jain', rank: 'DSP Headquarters' },
    { name: 'Yashwant Goyal', rank: 'SHO Maharajpura' },
    { name: 'Rohit Singh Bhadauria', rank: 'OP Baretha In-charge' },
    { name: 'Kshama Rajauriya', rank: 'OP Vehta In-charge' },
    { name: 'Jitendra Singh Tomar', rank: 'SHO Hazira' },
    { name: 'Santosh Singh Yadav', rank: 'SHO Purani Chhawni' },
    { name: 'Ravindra Jatav', rank: 'SHO University' },
    { name: 'Govind Bagauli', rank: 'SHO Sirol' },
    { name: 'Shakti Singh Yadav', rank: 'SHO Jhansi Road' },
    { name: 'Mahavir Singh', rank: 'SHO Behat' },
    { name: 'Saurabh Srivastava', rank: 'In-charge SHO Bijoli' },
    { name: 'Narendra Sisodiya', rank: 'SHO Utila' },
    { name: 'Devendra Lodhi', rank: 'SHO Hastinapur' },
    { name: 'Rashmi Bhadauria', rank: 'SHO Mahila Thana' },
    { name: 'Shailendra Bhargava', rank: 'SHO Padav' },
    { name: 'Prashant Sharma', rank: 'SHO Gwalior' }
];

const seedInitialData = async () => {
    try {
        const usersPlain = [
            {
                name: 'System Admin',
                email: 'admin@gwaliorpolice.gov.in',
                phone: '1234567890',
                password: 'password123',
                role: 'admin',
                city: 'Gwalior',
                state: 'Madhya Pradesh'
            },
            {
                name: 'Rahul Kumar',
                email: 'rahul@example.com',
                phone: '5556667777',
                password: 'password123',
                role: 'citizen',
                address: '123 Main St',
                city: 'Gwalior',
                state: 'Madhya Pradesh',
                pincode: '474001'
            },
            ...officersData.map((officer, index) => {
                const names = officer.name.split(' ');
                const firstName = names[0].toLowerCase();
                const lastName = names.length > 1 ? names[names.length - 1].toLowerCase() : '';
                return {
                    name: officer.name,
                    email: `${firstName}.${lastName}@gwaliorpolice.gov.in`.replace('..', '.'),
                    phone: `9876543${String(index).padStart(3, '0')}`,
                    password: 'password123',
                    role: 'police',
                    officerId: `GWL-${String(index + 1).padStart(3, '0')}`,
                    department: officer.rank,
                    policeStation: 'Gwalior HQ',
                    city: 'Gwalior',
                    state: 'Madhya Pradesh'
                };
            })
        ];

        await User.bulkCreate(usersPlain, { individualHooks: true });
        console.log('Initial police and admin users seeded successfully!');
    } catch (err) {
        console.error('Failed to seed initial data:', err.message);
    }
};

module.exports = { seedInitialData };
