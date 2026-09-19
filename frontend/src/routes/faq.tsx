import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FaqItem } from "../components/faq/FaqItem";
import { Footer } from "../components/footer/footer";
import { NavBar } from "../components/navBar/navBar";
import { FAQ_CATEGORIES, FAQ_ENTRIES } from "../data/faq";
import type { FaqCategoryId } from "../types/faq";
import styles from "./faq.module.scss";

export const Route = createFileRoute("/faq")({
    component: FAQPage,
});

/** Groups common questions by topic and keeps one answer open at a time. */
function FAQPage() {
    const [activeCategory, setActiveCategory] = useState<FaqCategoryId>("getting-started");
    const [openQuestion, setOpenQuestion] = useState<string | null>(FAQ_ENTRIES[0].question);

    const activeCategoryInfo = FAQ_CATEGORIES.find((category) => category.id === activeCategory) ?? FAQ_CATEGORIES[0];
    const visibleFaqs = FAQ_ENTRIES.filter((entry) => entry.category === activeCategory);

    // Open the first answer so a new category never looks empty.
    const chooseCategory = (category: FaqCategoryId) => {
        const firstQuestion = FAQ_ENTRIES.find((entry) => entry.category === category)?.question ?? null;
        setActiveCategory(category);
        setOpenQuestion(firstQuestion);
    };

    return (
        <div className={styles.page}>
            <NavBar />

            <main className={styles.faqMain}>
                <header className={styles.pageHeader}>
                    <div><span>Knotly help</span><h1>Frequently asked questions</h1><p>Clear answers about communities, conversations and your account.</p></div>
                    <strong>{FAQ_ENTRIES.length} answers</strong>
                </header>

                <nav className={styles.categoryTabs} aria-label="FAQ topics">
                    {FAQ_CATEGORIES.map(({ id, label, icon: Icon }) => (
                        <button key={id} type="button" className={activeCategory === id ? styles.activeCategory : ""} onClick={() => chooseCategory(id)}>
                            <Icon aria-hidden="true" /><span>{label}</span>
                        </button>
                    ))}
                </nav>

                <section className={styles.answersPanel} id="answers">
                    <header className={styles.answersHeader}>
                        <div><span>{activeCategoryInfo.label}</span><p>{activeCategoryInfo.description}</p></div>
                        <strong>{visibleFaqs.length}</strong>
                    </header>
                    <div className={styles.faqList}>
                        {visibleFaqs.map((entry) => (
                            <FaqItem
                                key={entry.question}
                                entry={entry}
                                isOpen={openQuestion === entry.question}
                                onToggle={() => setOpenQuestion((current) => current === entry.question ? null : entry.question)}
                            />
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
