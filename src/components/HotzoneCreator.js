import {Form, Button, Modal} from 'react-bootstrap';
import {useState} from 'react';
import '../styles/HotzoneCreator.css';
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";


function HotzoneCreator() {
    const [latitude,setLatitude] = useState(null);
    const [longitude,setLongitude] = useState(null);
    const [showLatitudeError, setShowLatitudeError] = useState(false);
    const [showLongitudeError, setShowLongitudeError] = useState(false);

    function handleEvent(e) { 
        if(e.target.name === 'latitude'){
            setLatitude(e.target.value);
        }else{
            setLongitude(e.target.value);
        }   
    }

    function handleSubmit(e){
        e.preventDefault();
        setShowLongitudeError(false);
        setShowLatitudeError(false);
        document.getElementById('latitude').style.display = "none";
        document.getElementById('longitude').style.display = "none";

        if(!/^([0-9]+|\.[0-9]+)+$/gm.test(latitude)){
            setShowLatitudeError(true);
            document.getElementById('latitude').style.display = "block";
        }

        if(!/^([0-9]+|\.[0-9]+)+$/gm.test(longitude)){
            setShowLongitudeError(true);   
            document.getElementById('longitude').style.display = "block";
        }
        
        if(!showLatitudeError && !showLongitudeError){

            console.log('submit pressed');
            sendDataToEventbridge();            
        }

    }

    async function sendDataToEventbridge(){
        // a client can be shared by different commands.
        const client = new EventBridgeClient({
            region: "us-east-1",
            credentials: {
                accessKeyId: 'ASIATRCE5IHPFK4L4S5G',
                secretAccessKey: 'zEsVDn9rU4HSTsfv90vRfj50ugbx5r2vLYbp6ATQ',
                sessionToken:'FwoGZXIvYXdzEPP//////////wEaDNrNSyeZ9aUZr4uCbSLAATYRt6r3YSDSiDc9XvgFRgvqzuHpZYppSwbzpjjuWDX6ToJESNjoEmXp1x2oaWIaQOaAGt5hMTYgyM7Rj3243Z7iEL3R8RcNVdP/YY9VCwjnIs2mlWROZ1FJ7BzY+zP5otyAru0lWG7NW4+Bzug0UxLPFXuxqhDlbWxjbULsjhDrsFcslJOVzJgyz84F3uiRuEisTqmT77nrsQScmoLgLaftDEBX1HK8gS0LoZM6nsuvY72gg7tQW2b+fD6uBX22eyjsyqySBjItik2D601CJDef3Alaiy1Me/jQMizePsTUkfH5eYlr2ROtZLopuLygNt1BO+3R'
            },
        });

        const params = {
            Entries: [
               { 
                    Detail: JSON.stringify({
                        "latitude": latitude,
                        "longitude": longitude
                    }),
                    DetailType: 'hotzone',
                    EventBusName: 'default',
                    Source: 'cct-web',
                }
            ]
        };

        try {
            const data = await client.send(new PutEventsCommand(params));
            console.log("Success, event sent; requestID:", data);
            return data; // For unit tests.
          } catch (err) {
            console.log("Error", err);
          }


        // client.send(command).then(
        //     (data) => {
        //         // process data.
        //     },
        //     (error) => {
        //         // error handling.
        //         console.log(error);
        //     }
        // );
    }

    return (
        <div className="App">
        <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>Create Hotzone</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group style={{textAlign: 'left'}} className="mb-3" controlId="formBasicEmail">
                        <Form.Label >Latitude</Form.Label>
                        <Form.Control name='latitude' isInvalid={showLatitudeError} required onChange={handleEvent}/>
                        <Form.Label id='latitude' className='errorMessage'>Invalid Format</Form.Label>
                    </Form.Group>
                    <Form.Group style={{textAlign: 'left'}} className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control name='longitude' isInvalid={showLongitudeError} required onChange={handleEvent}/>
                        <Form.Label id='longitude' className='errorMessage'>Invalid Format</Form.Label>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal.Dialog>
        </div>
    );
}

export default HotzoneCreator;
