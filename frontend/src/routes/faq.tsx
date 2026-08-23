import { Plus } from "lucide-react";
import { useState } from "react";
import { BackgroundShapes } from "../components/BackgroundShapes";
import { Footer } from "../components/footer/Footer";
import styles from "./faq.module.scss";
import { Link, createFileRoute } from "@tanstack/react-router";
import { NavBar } from "../components/navBar/navBar";

export const Route = createFileRoute("/faq")({
    component: RouteComponent,
});

interface FAQItemProps {
    question: string;
    answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`${styles.faqItem} ${isOpen ? styles.open : ""}`}>
            <button className={styles.question} onClick={() => setIsOpen(!isOpen)}>
                <span>{question}</span>
                <Plus className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`} />
            </button>
            <div className={styles.answer}>
                <p>{answer}</p>
            </div>
        </div>
    );
}

export function RouteComponent() {
    const faqs = [
        {
            question: "What is Knotly?",
            answer: "Knotly is a community communication platform that allows you to create and join secure discussion spaces. You can organize your conversations with text and voice channels, share content, and build a community around your passions.",
        },
        {
            question: "How do I create a community?",
            answer: "After creating your account, click the 'Create a Community' button on your dashboard. Give your community a name, choose an icon, and set up your first channels. You can then invite members via an invitation link.",
        },
        {
            question: "Is Knotly free?",
            answer: "Yes, Knotly is currently free in beta. We offer all essential features at no cost. Premium options may be introduced in the future for advanced features.",
        },
        {
            question: "Are my conversations secure?",
            answer: "Absolutely. All your conversations are protected with end-to-end encryption (E2E). This means only you and the recipients can read the messages. Our Apache Kafka-based infrastructure also ensures reliable and fast messaging.",
        },
        {
            question: "Can I use Knotly for my professional team?",
            answer: "Yes! Knotly is perfect for professional teams. You can create dedicated channels for different projects, share files, organize voice meetings, and manage permissions for each member.",
        },
        {
            question: "How do I invite people to my community?",
            answer: "In your community settings, you'll find an 'Invitations' option that generates a unique link. Share this link with the people you want to invite. You can also set an expiration date or maximum number of uses for this link.",
        },
        {
            question: "Can I customize my community?",
            answer: "Yes, you can customize your community icon, create custom channels, define roles with specific permissions, and organize your channels by categories.",
        },
        {
            question: "What voice features are available?",
            answer: "Knotly offers high-quality voice channels where you can chat in real-time with members of your community. Perfect for team meetings, gaming sessions, or simply hanging out with friends.",
        },
        {
            question: "How do I manage member permissions?",
            answer: "As an administrator or moderator, you can create custom roles with specific permissions (send messages, manage channels, invite members, etc.) and assign them to community members.",
        },
        {
            question: "Is Knotly available on mobile?",
            answer: "Currently, Knotly is accessible via web browser on desktop and mobile. Native mobile applications for iOS and Android are in development and will be available soon.",
        },
        {
            question: "How do I report inappropriate behavior?",
            answer: "You can report a message or user by clicking on the message options (three dots) and selecting 'Report'. Our moderation team will review all reports as soon as possible.",
        },
        {
            question: "How can I delete my account?",
            answer: "Go to Settings > Account > Delete my account. Please note that this action is irreversible and will delete all your personal data and messages from our servers.",
        },
    ];

    return (
        <div className={styles.faq}>
            <BackgroundShapes />
            <NavBar />

            <main className={styles.main}>
                <div className={styles.header}>
                    <h1>Frequently Asked Questions</h1>
                    <p className={styles.subtitle}>Find answers to the most common questions about Knotly</p>
                </div>

                <div className={styles.faqList}>
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>

                <div className={styles.contact}>
                    <h2>Can't find your answer?</h2>
                    <p>Our support team is here to help</p>
                    <Link to="/signup" className={styles.button}>
                        Contact Us
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
