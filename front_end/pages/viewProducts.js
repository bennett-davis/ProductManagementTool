import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Input } from 'reactstrap';

export default function ViewProducts ( { products }) {

    var productList = []

    products.forEach(product => {
        productList.push(product)
    });

    productList.forEach(element => {
        var newDate = new Date(element.available_on).toDateString()
         element.available_on = newDate
    })
    

    function searchProducts (){
        var pro = document.getElementsByClassName("product");
        var input = document.getElementById("searchBar");
        for (let index = 0; index < productList.length; index++) {
            if(productList[index].name.toUpperCase().includes(input.value.toUpperCase())){
                pro[index].style.display = ""
            }
            else {
                pro[index].style.display = "none"
            }
        }
    }

    
    return (
        
        <main>
            <Container>
                <div className={styles.container}>
                    <h1 className={styles.title}>View All Products</h1>

                    <div className={styles.searchBar}>
                    <Input 
                       
                        id="searchBar"
                        name="searchBar"
                        placeholder="Search"
                        type="search"
                        onChange={searchProducts}
                    />
                    </div>

                    {productList.map((product) => (
                        
                        <div className="product">
                            <Row>
                                <Col>
                                    <h5>Product Name</h5>
                                    <h3>{product.name}</h3>
                                </Col>
                                <Col>
                                    <h5>Product UPC</h5>
                                    <h3>{product.upc}</h3>
                                </Col>
                                <Col>
                                    <h5>Product Available On</h5>
                                    <h3>{product.available_on}</h3>
                                </Col>
                            </Row>

                            {product.properties.length > 0 ? <h5><u>Product Properties</u></h5> : null}
                            {product.properties.map((property) =>(
                                <div>
                                    <p>{property.name}: {property.value}</p>
                                </div>
                            ))}
                            <hr/>
                        </div>
                    )
                    )}
                </div>
            </Container>
            
        </main>
    );
}

export async function getServerSideProps() {

    const endpoint = 'http://localhost:3001/products'

    // Form the request for sending products to the server.
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        
    }

    // Fetch products from external API
    const res = await fetch(endpoint, options)
    const products = await res.json()
    
    // Pass products to the page via props
    return { props: { products } }
  }