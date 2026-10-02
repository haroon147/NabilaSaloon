import type { Service, Employee, Booking, User, Review, AdminStats } from '../types';

export const SERVICES: Service[] = [
  { id: 's1',  name: "Women's Haircut & Style",    description: "Precision cut tailored to your face shape, finished with a blow-dry and style.", category: 'Hair',     durationMinutes: 60,  price: 2500  },
  { id: 's2',  name: 'Hair Coloring',               description: 'Full head color using premium ammonia-free dyes. Includes toner and conditioning treatment.', category: 'Hair',     durationMinutes: 120, price: 6500  },
  { id: 's3',  name: 'Balayage & Highlights',       description: 'Hand-painted highlights for a natural sun-kissed look. Includes toning.', category: 'Hair',     durationMinutes: 150, price: 9000  },
  { id: 's4',  name: 'Keratin Smoothing Treatment', description: 'Eliminate frizz and add shine for up to 4 months with our keratin formula.', category: 'Hair',     durationMinutes: 180, price: 12000 },
  { id: 's5',  name: 'Blow Dry & Styling',          description: 'Professional blow-dry with your choice of finish — straight, wavy, or voluminous.', category: 'Hair',     durationMinutes: 45,  price: 1800  },
  { id: 's6',  name: 'Classic Manicure',            description: 'Nail shaping, cuticle care, hand massage, and your choice of polish.', category: 'Nails',    durationMinutes: 45,  price: 1200  },
  { id: 's7',  name: 'Gel Pedicure',                description: 'Relaxing foot soak, exfoliation, massage, and long-lasting gel polish.', category: 'Nails',    durationMinutes: 60,  price: 1800  },
  { id: 's8',  name: 'Hydrating Facial',            description: 'Deep-cleanse, exfoliation, mask, and moisturiser for glowing skin.', category: 'Skin',     durationMinutes: 75,  price: 3500  },
  { id: 's9',  name: 'Threading & Brow Shaping',    description: 'Precise brow threading and shaping to frame your face perfectly.', category: 'Skin',     durationMinutes: 20,  price: 500   },
  { id: 's10', name: 'Bridal Package',              description: 'Full bridal glam: hair styling, makeup, manicure, pedicure, and brow shaping.', category: 'Packages', durationMinutes: 300, price: 25000 },
];

export const EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Zara Ahmed',   specialties: ['Hair Coloring','Balayage','Keratin Treatment'],       rating: 4.9, reviewCount: 124, availability: [{ day:'Monday',start:'09:00',end:'18:00'},{ day:'Tuesday',start:'09:00',end:'18:00'},{ day:'Wednesday',start:'09:00',end:'18:00'},{ day:'Thursday',start:'09:00',end:'18:00'},{ day:'Friday',start:'10:00',end:'17:00'}] },
  { id: 'e2', name: 'Layla Hassan', specialties: ['Manicure','Pedicure','Nail Art','Gel Extensions'],    rating: 4.8, reviewCount: 98,  availability: [{ day:'Monday',start:'10:00',end:'19:00'},{ day:'Tuesday',start:'10:00',end:'19:00'},{ day:'Thursday',start:'10:00',end:'19:00'},{ day:'Friday',start:'10:00',end:'19:00'},{ day:'Saturday',start:'09:00',end:'20:00'}] },
  { id: 'e3', name: 'Nadia Khan',   specialties: ['Facial','Skin Care','Threading','Waxing'],           rating: 4.7, reviewCount: 87,  availability: [{ day:'Tuesday',start:'09:00',end:'17:00'},{ day:'Wednesday',start:'09:00',end:'17:00'},{ day:'Thursday',start:'09:00',end:'17:00'},{ day:'Saturday',start:'10:00',end:'18:00'},{ day:'Sunday',start:'10:00',end:'16:00'}] },
  { id: 'e4', name: 'Aisha Malik',  specialties: ['Bridal Styling','Makeup','Hair Styling','Blow Dry'], rating: 4.9, reviewCount: 156, availability: [{ day:'Monday',start:'09:00',end:'18:00'},{ day:'Wednesday',start:'09:00',end:'18:00'},{ day:'Friday',start:'09:00',end:'18:00'},{ day:'Saturday',start:'09:00',end:'20:00'},{ day:'Sunday',start:'10:00',end:'17:00'}] },
  { id: 'e5', name: 'Fatima Ali',   specialties: ['Haircut','Blow Dry','Manicure','Threading'],         rating: 4.6, reviewCount: 72,  availability: [{ day:'Monday',start:'11:00',end:'20:00'},{ day:'Tuesday',start:'11:00',end:'20:00'},{ day:'Wednesday',start:'11:00',end:'20:00'},{ day:'Friday',start:'11:00',end:'20:00'},{ day:'Saturday',start:'10:00',end:'19:00'}] },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sara Khan',   email: 'sara@demo.com',   phone: '0300-1111111', role: 'client'   },
  { id: 'e1', name: 'Zara Ahmed',  email: 'zara@nabilasalon.com',  phone: '0300-2222222', role: 'employee' },
  { id: 'a1', name: 'Nabila Admin', email: 'admin@nabilasalon.com', phone: '0300-3333333', role: 'admin'    },
];

export const SAMPLE_BOOKINGS: Booking[] = [
  { id:'b1', clientId:'u1', clientName:'Sara Khan',  employeeId:'e1', employeeName:'Zara Ahmed',  serviceId:'s2',  serviceName:'Hair Coloring',             date:'2026-07-10', startTime:'10:00', endTime:'12:00', status:'confirmed',  price:6500  },
  { id:'b2', clientId:'u1', clientName:'Sara Khan',  employeeId:'e2', employeeName:'Layla Hassan', serviceId:'s6',  serviceName:'Classic Manicure',          date:'2026-07-14', startTime:'14:00', endTime:'14:45', status:'pending',    price:1200  },
  { id:'b3', clientId:'u1', clientName:'Sara Khan',  employeeId:'e4', employeeName:'Aisha Malik',  serviceId:'s10', serviceName:'Bridal Package',            date:'2026-06-21', startTime:'09:00', endTime:'14:00', status:'completed',  price:25000 },
  { id:'b4', clientId:'u1', clientName:'Sara Khan',  employeeId:'e3', employeeName:'Nadia Khan',   serviceId:'s8',  serviceName:'Hydrating Facial',          date:'2026-06-11', startTime:'11:00', endTime:'12:15', status:'completed',  price:3500  },
  { id:'b5', clientId:'u1', clientName:'Sara Khan',  employeeId:'e5', employeeName:'Fatima Ali',   serviceId:'s1',  serviceName:"Women's Haircut & Style",   date:'2026-06-26', startTime:'15:00', endTime:'16:00', status:'cancelled',  price:2500  },
  { id:'b6', clientId:'u2', clientName:'Amna Raza',  employeeId:'e1', employeeName:'Zara Ahmed',  serviceId:'s3',  serviceName:'Balayage & Highlights',     date:'2026-07-08', startTime:'11:00', endTime:'13:30', status:'confirmed',  price:9000  },
  { id:'b7', clientId:'u3', clientName:'Hira Baig',  employeeId:'e2', employeeName:'Layla Hassan', serviceId:'s7',  serviceName:'Gel Pedicure',              date:'2026-07-09', startTime:'15:00', endTime:'16:00', status:'pending',    price:1800  },
];

export const REVIEWS: Review[] = [
  { id:'r1', bookingId:'b3', employeeId:'e4', rating:5, comment:'Aisha was absolutely incredible for my wedding. Everyone was complimenting my look all day!' },
  { id:'r2', bookingId:'b4', employeeId:'e3', rating:5, comment:'Best facial I\'ve ever had. My skin was glowing for weeks after!' },
];

export const ADMIN_STATS: AdminStats = {
  totalBookings: 142,
  todayBookings: 8,
  monthRevenue: 385000,
  activeClients: 67,
  completionRate: 94,
};
