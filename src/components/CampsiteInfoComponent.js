import React, { Component } from 'react';
import { Button, Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Label, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

function RenderCampsite({ campsite }) {
    return (
        <div className="col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(1) translateY(-80%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    )
}
function RenderComments({ comments, addComment, campsiteId }) {
    if (comments) {
        return (
            <div className='col-md-5 m-1'>
                <h4>Comments</h4>
                <Stagger in>
                    {
                        comments.map(comment => {
                            return (
                                <Fade in key={comment.id}>
                                    <div>
                                        <p>
                                            {comment.text}<br />
                                            -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                        </p>
                                    </div>
                                </Fade>
                            );
                        })
                    }
                </Stagger>
            </div>
        )
    }
    return <div />
}

function CampsiteInfo(props) {
    if(props.isLoading) {
        return(
            <div className='container'>
                <div className='row'>
                    <Loading />
                </div>
            </div>
        )
    }

    if(props.errMess) {
        <div className='container'>
                <div className='row'>
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
    }

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
                    <RenderComments 
                    comments={props.comments} 
                    addComment={props.addComment}
                    campsiteId={props.campsite.id}
                    />
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
        this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text);
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