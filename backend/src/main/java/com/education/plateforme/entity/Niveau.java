package com.education.plateforme.entity;


public enum Niveau {
    SEPTIEME("7ème année"),
    HUITIEME("8ème année"),
    NEUVIEME("9ème année"),
    PREMIERE_SECONDAIRE("1ère année secondaire"),
    DEUXIEME_SECONDAIRE("2ème année secondaire"),
    TROISIEME_SECONDAIRE("3ème année secondaire"),
    BACCALAUREAT("4ème année secondaire (Bac)");

    private final String libelle;

    Niveau(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}
