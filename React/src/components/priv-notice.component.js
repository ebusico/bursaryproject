import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { authService } from './modules/authService';
import axios from 'axios';
import '../css/privacy-notice.css';


const privText = <div className='priv-text'><h4 id="modal-label" className="priv-notice-title">Privacy Notice</h4><p>The QA group of companies ("QA", "we", "our" or "us") are committed to ensuring that your privacy is protected. This Privacy Notice describes how we use the personal information that we collect from you, or that you provide, when you:</p>
    <ul>
        <li>visit any of our websites, portals or online learning environments (the "Website");</li>
        <li>use the educational services, testing, certification, products, and consultancy services (together the "Services") that we provide; or</li>
        <li>communicate with us.</li>
    </ul>
    <p><strong>Information We Collect</strong></p>
    <p><span>Information that you provide directly</span></p>
    <p>We collect personal information from you:</p>
    <ul>
        <li>through the use of forms, which may be on paper or on our Websites, such as when you login to access our Services, signup to receive our newsletters, register for information, or make a purchase or commence a course of study;</li>
        <li>when you create an account on our Websites and provide us with information about any special requirements, such as dietary requirements, that you may have; and </li>
        <li>if you choose to provide us with information when you use our Website or access our Services;</li>
        <li>when you communicate with us for any reason, including by email, postal mail or telephone, and when you use our Services.</li>
    </ul>
    <p>Some of the personal information that you provide may include sensitive personal information, such as health-related information or information about your race or ethnicity, which we need for statutory registration/reporting purposes and to ensure that we can provide the necessary duty of care.</p>
    <p><span>Information that we collect automatically</span></p>
    <p>When you visit our Website, we may collect certain information automatically from your device.</p>
    <p>Specifically, the information we collect automatically may include information like your IP address, device type, unique device identification numbers, browser-type, broad geographic location (e.g. country or city-level location) and other technical information. We may also collect information about how your device has interacted with our Website, including the pages accessed and links clicked.</p>
    <p>Collecting this information enables us to better understand the visitors who come to our Website, where they come from, and what content on our Website is of interest to them. We use this information for our internal analytics purposes and to improve the quality and relevance of our Website to our visitors.</p>
    <p>Some of this information may be collected using cookies and similar tracking technology, as explained further under the heading 'Cookies', below.</p>
    <p><span>Information that we obtain from third party sources</span></p>
    <p>We may receive personal information about you from third party sources (such as your employer if they enroll you on a course, or agencies if you apply for study or employment, but only where we believe that these third parties either have your consent or are otherwise legally permitted or required to disclose your personal information to us. We collect only the minimum amount of information required from these third parties to enable us to provide the requested service or process any application you send to us (for example, your educational or employment history). We only use the information we receive from these third parties as set out in this Privacy Notice.</p>
    <p><strong>Use of Your Information</strong></p>
    <p>The information that we collect and store relating to you is primarily used to enable us to provide our Services to you. In addition, we may use the information for the following purposes:</p>
    <ul>
        <li>to provide you with information or Services you request from us;</li>
        <li>to provide information on other QA products and Services which we feel may be of interest to you, in accordance with your communications and consent preferences;</li>
        <li>to meet our contractual commitments to you;</li>
        <li>to act on your behalf where third party involvement is available and appropriate &ndash; for example through a third party specialist training provider or certification/awarding body;</li>
        <li>to obtain additional personal information to secure funding or satisfy statutory legal or Government scheme requirements &ndash; for example through an Apprenticeship scheme;</li>
        <li>to monitor and analyze trends, usage and activities in connection with our Websites/Services; andas necessary to prevent or detect crime.</li>
    </ul>
    <p>We may also monitor or record telephone calls for training, customer service and quality assurance purposes, and to detect or prevent crime, [and will inform you that we do so when you call us]. These recordings will be retained for a maximum of 30 days.</p>
    <p>In general, we will use any of the information we collect from you only for the purposes described in this Privacy Notice or for purposes that we explain to you at the time we collect such information. However, we may also use your personal information for other purposes that are not incompatible with the purposes we have disclosed to you (such as statistical purposes) if and where this is permitted by applicable data protection laws.</p>
    <p>If you do not want us to use your data for any marketing purposes, you will have the opportunity to withhold your consent to this when you provide your details to us.</p>
    <p>Consent can be varied online via the Website or cp.qa.com.</p>
    <p><strong>Storing and Retaining Your Personal Data</strong></p>
    <p>The personal information you provided to us is stored within secure servers. We use appropriate technical and organisational measures to protect the personal information that we collect and process about you. The measures we use are designed to provide a level of security appropriate to the risk of processing your personal information.</p>
    <p>All QA email addresses support TLS email encryption, so it is advised that if you are concerned about the contents of any email to use this encryption.</p>
    <p>Where we have given you (or where you have chosen) a password so that you can access certain parts of our sites and portals, you are responsible for keeping these passwords confidential.</p>
    <p>Please note that the transmission of information via the internet (including email) is not completely secure and therefore, although we endeavor to protect the personal information you provide to us, we cannot guarantee the security of data sent to us electronically and the transmission of such data is therefore entirely at your own risk.We retain personal information we collect from you where we have an ongoing legitimate business need to do so (for example, to provide you with a service you have requested or to comply with applicable legal, tax or accounting requirements).</p>
    <p>When we have no ongoing legitimate business or statutory need to process your personal information, we will either delete or anonymise it.</p>
    <p><strong>Disclosing Your Information</strong></p>
    <p>We may disclose your personal information, with your consent, to any company within our corporate group. This includes, where applicable, our subsidiaries, our holding company and its subsidiaries.</p>
    <p>We may also disclose your personal information with:</p>
    <ul>
        <li>third party service providers and partners who provide data processing services to us (for example, to support the delivery of Services), or who otherwise process personal information for purposes that are described in this Privacy Notice;</li>
        <li>third party funders, where required within Apprenticeships or further/higher education;</li>
        <li>your employer, where required within an Apprenticeship program/Higher Education program or other</li>
        <li>government agencies, where required by the scheme or education path you elect to follow; </li>
        <li>partners with whom we work to provide Services (such as course vendors, examination bodies and trainers); </li>
        <li>any third party in connection with, or during negotiations of, any merger, sales of company assets, financing or acquisition of all or a portion of our business by another company; </li>
        <li>any law enforcement agency, court, regulator, government authority or other third party where we believe this is necessary to comply with a legal or regulatory obligation, or otherwise to protect our rights or the rights of any third party; and to </li>
        <li>any other person with your consent to the disclosure. </li>
    </ul>
    <p>Where you are a customer or prospective customer, we may disclose your data to third parties for our marketing purposes so that we can identify products and services we think you will be interested in. Personal data used in this way may include contact details such as name, address, phone number, and email address. When sharing with third party marketing organisations, your data may be processed in countries inside or outside of the EU.</p>
    <p><strong>Third Party Links</strong></p>
    <p>You might find links to third party websites on our Websites or within documentation we provide.</p>
    <p>If you access other websites using the links provided, the operators of these sites may collect information from you which will be used by them in accordance with their own privacy policies which you should review.</p>
    <p>We do not accept any responsibility or liability for their policies whatsoever as we have no control over them.</p>
    <p><strong>Social Networking</strong></p>
    <p>The Website may offer you the opportunity to share or follow information about us (or the Website or our Services) using third party social networking functionality (such as through "share this", "like" or "follow" buttons).</p>
    <p>We offer this functionality in order to generate interest in us, the Website and our Services among the members of your social networks, and to permit you to share and follow opinions, news and recommendations about us with your friends. However, you should be aware that sharing personal or non-personal information with a social network may result in that information being collected by the social network provider or result in that information being made publicly-available, including through Internet search engines.</p>
    <p>Please note that we do not exercise, endorse or control the policies or practices of any third party social network whose functionality you may access through the Website.</p>
    <p>You should always read the Privacy Notice of any social network through which you share information carefully in order to understand their specific privacy and information usage practices.</p>
    <p><strong>International Data Transfers</strong></p>
    <p>For some of our Services, your personal information may be transferred to, and processed in, countries outside of the EEA. However, we have taken appropriate safeguards to require that your personal information will remain protected in accordance with this Privacy Notice. These measures include transferring your personal data to third parties who are located in a country which the European Commission has determined has data protection laws that are at least as protective as those in Europe, and transferring your personal data to third parties who have entered into standard contractual clauses with us. For more information about these safeguards please contact us using the contact details provided below.</p>
    <p><strong>Cookies</strong></p>
    <p>We use cookies and similar tracking technology (collectively, "Cookies") to collect and use personal information about you. For further information about the types of Cookies we use, why we use them and how you can control Cookies please see our Cookie Notice at: <a href="http://www.qa.com/legal/cookie-notice">www.qa.com/legal/cookie-notice</a></p>
    <p><strong>Legal Basis (EEA visitors only).</strong></p>
    <p>Our legal basis for collecting and using personal information will depend on the personal information being collected and the specific context in which we collect it.</p>
    <p>However, we will normally collect personal information from you only:</p>
    <ul>
        <li>where we need the personal information to perform a contract with you (for example, to enroll you into a course or provide you with learning materials);</li>
        <li>where the processing is in our legitimate interests and is not overridden by your rights; or</li>
        <li>where we have your consent to do so;</li>
    </ul>
    <p>In some cases, we may also have a legal obligation to collect personal information from you.</p>
    <p>If we ask you to provide personal information to comply with a legal requirement or to perform a contact with you, we will make this clear at the relevant time and advise you whether the provision of your personal information is mandatory or not (as well as of the possible consequences if you do not provide your personal information).</p>
    <p>If we collect and use your personal information in reliance on our legitimate interests (or those of any third party), this interest will normally be to operate our platform and communicating with you as necessary to provide our services to you and for our legitimate commercial interest, for instance, when responding to your queries, improving our platform, undertaking marketing, or for the purposes of detecting or preventing illegal activities. We may have other legitimate interests and if appropriate we will make clear to you at the relevant time what those legitimate interests are.</p>
    <p>If you have questions about or need further information concerning the legal basis on which we collect and use your personal information, please contact us using the contact details provided below.</p>
    <p><strong>Data protection rights</strong></p>
    <p>You have the following data protection rights:</p>
    <ul>
        <li>If you wish to <strong>access, correct, update or request deletion</strong> of your personal information, you can do so at any time by contacting us using the contact details provided below.</li>
        <li>In addition, you can <strong>object to processing</strong> of your personal information, ask us to <strong>restrict processing</strong> of your personal information or <strong>request portability</strong> of your personal information. Again, you can exercise these rights by contacting us using the contact details provided below.</li>
        <li>You have the right to <strong>opt-out of marketing and telemarketing communications</strong> we send you at any time. You can exercise this right by clicking on the "Manage your Marketing Preferences" link in the marketing e-mails we send you and within our Websites. </li>
        <li>Similarly, if we have collected and process your personal information with your consent, then you can <strong>withdraw your consent</strong> at any time. Withdrawing your consent will not affect the lawfulness of any processing we conducted prior to your withdrawal, nor will it affect processing of your personal information conducted in reliance on lawful processing grounds other than consent.</li>
        <li>You have the <strong>right to complain to a data protection authority</strong> about our collection and use of your personal information. For more information, please contact your local data protection authority.</li>
    </ul>
    <p>We respond to all requests we receive from individuals wishing to exercise their data protection rights in accordance with applicable data protection laws.</p>
    <p><strong>Contacting Us</strong></p>
    <p>The data controller of your personal information will be the QA group entity that you are dealing with, and as such will be one of the following:</p>
    <ul>
        <li>QA Limited</li>
        <li>QA Consulting Services Limited</li>
        <li>QAHE Limited </li>
        <li>QAHE (UR) Limited </li>
        <li>QAHE (Ulst) Limited </li>
        <li>QAHE (NU) Limited </li>
        <li>QAHX (Mdx) Limited </li>
        <li>QAHE (Services) Limited </li>
        <li>QAHE (Solent) Limited </li>
        <li>Branch Campus (London and Birmingham) Limited NI </li>
        <li>Northumbrian London Campus Limited </li>
        <li>Roehampton Pathway Campus Limited </li>
        <li>Solent Pathway Campus Limited </li>
        <li>Focus Project Management Europe Limited</li>
    </ul>
    <p>We welcome any queries, comments or requests you may have regarding this Privacy Notice. Please do not hesitate to contact us, or our DPO, via email at: <a href="mailto:privacy@qa.com">privacy@qa.com</a></p>
    <p><strong>Changes to the Privacy Notice</strong></p>
    <p>We may change this Privacy Notice from time to time by updating this document. The online version is available at: <a href="http://www.qa.com/legal/privacy-notice">www.qa.com/legal/privacy-notice</a></p>
    <p>You should check this page from time to time to ensure that you are happy with any changes.</p>
    <p>If material changes are made to this Privacy Notice, we will notify you by placing a prominent notice on the Website or by contacting you to let you know via the contact details you have provided us with.</p>
    <p>By clicking the button below, you accept the terms of this Privacy Notice.</p>
    </div>;

class PrivNotice extends Component {
    constructor(...args) {
        super(...args);
        this.state = { 
            showModal: false,
            currentUser: authService.currentUserValue
         };

        this.close = () => {
            this.setState({ showModal: false });
        };

        this.open = () => {
            this.setState({ showModal: true });
        };
    }

    componentDidMount(){
        axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/privacy/' + this.state.currentUser.token._id)
        .then(response => {
            console.log(response);
            if(response.data === 'Success'){
                this.setState({
                    showModal: false
                })
            }
            else if(response.data === 'Failed'){
                this.setState({
                    showModal: true
                })
            }
        });
    }

    render() {
        return (
            <div data-keyboard="false">

                <Modal
                    onHide={this.close}
                    backdrop='static'
                    size='lg'
                    dialogClassName="modal-style"
                    aria-labelledby="modal-label"
                    show={this.state.showModal}
                    keyboard={false}
                >
                {privText}
                <Button
                    className='priv-btn'
                    variant='secondary'
                    block='false'
                    //onClick={this.close}
                    onClick = {() => {
                        console.log(this.state.currentUser.token._id);
                        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/privacy/accept/'+this.state.currentUser.token._id).then(() => this.setState({ showModal: false })) } }
                    //Additional logic is required for click event
                >Accept</Button>
                <br></br>
                </Modal>
            </div>
        );
    }
}

export default PrivNotice;
