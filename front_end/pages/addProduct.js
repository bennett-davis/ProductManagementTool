import styles from '../styles/Home.module.css'
import React from "react"
import { Container, Row, Col, Button} from "reactstrap"
import { Form, FormGroup, FormText, Label, Input, FormFeedback } from "reactstrap"
import { useState } from "react";
 
class Product {
    constructor () {
        this.name = ''
        this.upc = ''
        this.available_on = ''
        this.properties = []
    }
}

class Property {
    constructor () {
        this.name = ''
        this.value = new ProductProperty()
    }
}

class ProductProperty {
    constructor () {
        this.value = ''
    }
}

export default function NewProduct () {

    const [properties, setProperties] = useState( [] );
    

    function handleClick(){
        var newProperty;
        setProperties(oldProperties => [...oldProperties, newProperty]);
    };

    function handleRemoveClick(){
        setProperties(properties.slice(0, -1));
    };
     
    const handleSubmit = async (event) => {

        event.preventDefault()

        var propNames = document.getElementsByClassName('propertyName');
        var propValues = document.getElementsByClassName('propertyValue');

        const productProperties = [];

        for (let index = 0; index < properties.length; index++) {
            const temp = new Property();
            temp.name = propNames[index].value;
            temp.value = propValues[index].value;
            productProperties.push(temp);
           
        }

        const data = new Product();
       
        data = {
            name: event.target.productName.value,
            upc: event.target.upc.value,
            available_on: event.target.available_on.value,
            properties : productProperties
        }
    
        const JSONdata = JSON.stringify(data)

        console.log(JSONdata);
    
        const endpoint = 'http://localhost:3001/products/add'

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata,
        }
    
        const response = await fetch(endpoint, options)
    
        const result = await response.json()
        if (result.success === false){
            alert(result.message)
        }
        else {
            alert("Product has been added!")
        }

    }

    return (
        <main>
            <Container><h1 className={styles.title}>Add A New Product</h1>
                <div className={styles.container}>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup floating>
                            <Input
                                id="productName"
                                name="Product Name"
                                placeholder="Product Name"
                                type="text"
                            />
                            <Label for="productName">
                            Product Name
                            </Label>
                            <FormText>
                            Name must be a unique string between 0-1024 characters.
                            </FormText>
                        </FormGroup>
                        <FormGroup floating>
                            <Input
                                id="upc"
                                name="Product upc"
                                placeholder="UPC"
                                type="text"
                            />
                            <Label for="upc">
                            Product UPC
                            </Label>
                            <FormText>
                            UPC must be a numeric string that is 10, 12, or 13 characters.
                            </FormText>
                        </FormGroup>
                        <FormGroup floating>
                            <Input
                                id="available_on"
                                name="Product date"
                                placeholder="Available On"
                                type="date"
                            />
                            <Label for="available_on">
                            Available On
                            </Label>
                            <FormText>
                            Available on must be a vaild date in the future.
                            </FormText>
                        </FormGroup>
                        <Button onClick={handleClick} className={styles.button} style={{background: "black"}}>
                            Add Property 
                        </Button>
                        <Button onClick={handleRemoveClick} className={styles.button} style={{background: "black"}}>
                            Remove Property
                        </Button>

                        {properties.length > 0 ? <h4>Properties {properties}</h4> : null}
                        
                        {properties.map((property, index) => (
                            <Row key={index}>
                                <Col>
                                    <FormGroup floating>
                                        <Input
                                            className='propertyName'
                                            id="propertyName"
                                            name="Property Name"
                                            placeholder="Property Name"
                                            type="text"
                                        />
                                        <Label for="propertyName">
                                        Property Name
                                        </Label>
                                        <FormText>
                                        Property name must be a unique string, 0-255 characters long.
                                        </FormText>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup floating>
                                        <Input
                                            className='propertyValue'
                                            id="propertyValue"
                                            name="Property Value"
                                            placeholder="Property Value"
                                            type="text"
                                        />
                                        <Label for="propertyValue">
                                        Value
                                        </Label>
                                        <FormText>
                                        Value must be a string, 0-255 characters long.
                                        </FormText>
                                    </FormGroup>
                                </Col>
                            </Row>
                        ))}
                        
                        <Button className={styles.button} style={{background: "green"}}>
                            Save
                        </Button>
                        
                    </Form>
                </div>
            </Container>
        </main>
    )

}

 