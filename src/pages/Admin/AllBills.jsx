import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import Adminpanel from '../../components/layout/Adminpanel'
import axios from 'axios'
import { useAuth } from '../../context/Auth'
const AllBills = () => {
      const [auth] = useAuth();

      const [bills, setBills] = useState([]);


  const fetchBills = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/getbills`
      );
      const sortedBills = (res.data.bills || []).sort(
        (a, b) => new Date(b.month + "-01") - new Date(a.month + "-01")
      );
      setBills(sortedBills);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  useEffect(() => {
    if (auth?.user) fetchBills();
  }, [auth?.user]);
  return (
    <Layout>
        <div className=' flex flex-col lg:flex-row min-h-screen bg-gray-100'>
            <Adminpanel/>
        
    
        
           <div>
            Ernakulam
            <br />
                {bills.map((a)=>(
a.status
        ))

        }
            hello
           </div>

           </div>
        
    </Layout>
  )
}


export default AllBills
