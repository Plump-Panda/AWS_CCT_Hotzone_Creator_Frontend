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
                accessKeyId: 'ASIATRCE5IHPBQMHVYCK',
                secretAccessKey: '2/HNZoe3YG840ZVoUcJUoSkHxNr4FxeE5ARukXj2',
                sessionToken:'FwoGZXIvYXdzEAwaDBeTpSlgvp9TWeoLLiLAAbiHgcniX1JB8zVKMDAN8Yfwr9QTbiQt89Q558YZclkHDB8xB87Ava3j28gAqdLqkt/HRNR1K85kupCebiP+ZJAQyxJ90m23rhHxPISerkbtVxon5dGUlPUeUc8LKxEogUXg7staHSb6g3HTuMhuiYkEIOoVsjZE0J0DSq9tWXyHZ5jFXGJA0ZhzhDwn/2lLSJPhiM3M8qdqkMrapWRFk9fiisqlfvbmpWM2BI2Qn8jVu7zZAFE8HfWyyEknBIUumSjgirKSBjIt6qSrM4CddSq1hUG9XvQ1M0LBR8CsAqKsjuAMP24scAlwwvHb5twRieKt+2SO'
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
