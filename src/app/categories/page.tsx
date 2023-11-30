'use client'
import { useState, useEffect } from 'react';
import styles from '../page.module.css'

interface Category {
    id: number;
    name: string;
    stock: number;
  }

export default function Category(){
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('/api/categories', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
    
            if (response.ok) {
              const data = await response.json();
              setCategories(data.categories);
              console.log(data.categories,"catt")
            } else {
              console.error('Failed to fetch categories');
            }
          } catch (error) {
            console.error('Error fetching categories', error);
          }
        };
    
        fetchData();
      }, []);
    return(
      <main className={styles.main}>
        <div className={styles.description}>
            {categories.length > 0 ? (
                categories.map((category) => (
                    <div key={category.id}>
                        {category.name} available = {category.stock}
                    </div>
                ))
            ) : (
                <div>Loading...</div>
            )}
        </div>
      </main>
        
    )
}