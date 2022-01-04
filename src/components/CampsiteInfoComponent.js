import React, { Component } from 'react';
import { Button, Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Label, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

function RenderCampsite({ campsite }) {
    return (
        <div key={campsite.id} className='col-md-5 m-1'>
            <Card>
                <CardImg top src={campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
        </div>
    )
}
function RenderComments({ comments }) {
    if (comments) {
        return (
            <div className='col-md-5 m-1'>
                <h4>Comments</h4>
                {comments.map(comment => {
                    return (
                        <div key={comment.id}>
                            <p>{comment.text}</p>
                            <p>{comment.author} {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))} </p>
                        </div>
                    )
                })}
                <CommentForm/>
            </div>
        )
    }
    return <div />
}
function CampsiteInfo(props) {
    if (props.campsite) {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <Breadcrumb>
                            <BreadcrumbItem><Link to='/directory'>Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className='row'>
                    <RenderCampsite campsite={(props.campsite)} />
                    <RenderComments comments={(props.comments)} />
                </div>
            </div>
        )
    } else {
        return <div />
    }
}

const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);
const required = val => val && val.length;
class CommentForm extends Component{
    constructor(props){
        super(props);
        this.state= {
            isModalOpen: false,
            firstName: '',
            feedback:'',
            touched: {
                author: false,
            },
        }
        this.toggleModal = this.toggleModal.bind(this);
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit = (values) => {
        console.log("Current state is:" + JSON.stringify(values));
        alert("Current state is:" + JSON.stringify(values));
    }
    render() {
        return (
        <div>
            <Button className="fa-lg" outline type="submit" onClick={this.toggleModal}><i class="fa fa-pencil"></i>Submit Comment</Button>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                <ModalBody>
                <LocalForm onSubmit={values => this.handleSubmit(values)}>
                            <div className='form-group'>
                                <Label htmlFor="rating">Rating</Label>
                                <Control.select model=".rating" id="rating" name="rating" className="form-control">
                                <option value={0}>Select...</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                </Control.select> 
                            </div>
                        <div className='form-group'>
                            <Label htmlFor="author">Your Name</Label>
                            <Control.text model=".author" type="text" id="author" name="author" className='form-control' placeholder="Your Name"
                                        validators={{
                                            required,
                                            minLength: minLength(2),
                                            maxLength: maxLength(15)
                                        }}
                                    innerRef={input => this.author = input} />
                                    <Errors
                                        className='text-danger'
                                        model=".author"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be at least 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                        </div>
                        <div className='form-group'>
                            <Label htmlFor="comment">Comment</Label>
                            <Control.textarea model=".comment" type="text" id="comment" name="comment" className='form-control'
                                    innerRef={input => this.author = input} />
                        </div>
                        <Button className="fa-lg bg-primary text-white" outline type="submit">Submit</Button>
                        </LocalForm>
                </ModalBody>
            </Modal>
        </div>
        )
    }
}

export default CampsiteInfo;