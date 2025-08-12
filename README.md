# biblio_tool (my-biblio-tool)

## Documentation

### Reference TAG

Pour donner un tag a une référence et ainsi classer celle-ci dans une catégorie. Par exemple, si je travaille sur 2 projets différents, je peux inclure un tag pour associer la ref à un des 2 projets ou plusieurs projets

## DOI & ISBN search

Certain type de références peuvent avoir un DOI et/ou un ISBN, dans la fonction de recherche on va donc intégrer les 2.

Recherche d'abord le DOI, si tu ne trouves rien recherche l'ISBN

C'est à l'utilisateur de bien choisir sa catégorie pour qu'ensuite le formulaire match.

### Test ISBN and DOI

article
10.1186/2192-5372-3-4
10.1177/0309132519898254
10.1080/03066150.2025.2528861
10.1080/14649365.2022.2055778

book
978-0299326104
9781522968122
8408052942

report
10.1787/01820d6d-en

book chapter

### Add type reference

book, article, report done !

1- Ajout type dans citation
2- Ajout de la ref dans le style Chicago, MLA, APA... de formatReference
3- Ajout computed de la props concerné si existe
4- Ajuster les styles
5- Ajout de la props à citationHtml

### format style

#### Chicago

Baird, Ian G. 2020. Rise of the Brao: Ethnic Minorities in Northeastern Cambodia during Vietnamese Occupation. University of Wisconsin Press.

Dorkenoo, Kelly, and Phasy Res. 2025. “On The Production of Climate-related Loss: Land Dispossession, Indebtedness, and Climate Change in Northeastern Cambodia.” The Journal of Peasant Studies, August, 1–30. https://doi.org/10.1080/03066150.2025.2528861.

Ashta, Arvind, Mawuli Couchoro, and Abu Saleh Musa. 2014. “Dialectic evolution through the social innovation process: from microcredit to microfinance.” Journal of Innovation and Entrepreneurship 3 (1): 4. https://doi.org/10.1186/2192-5372-3-4.

_PISA 2022 Technical report_. 2024. _Programme for International Student Assessment/Internationale Schulleistungsstudie_. https://doi.org/10.1787/01820d6d-en.

Doe, Jane B. 2021. "Quantum Realities." In Advances in Modern Physics, edited by John A. Smith and Emily R. Lee, 101–125. New York: Oxford University Press. https://doi.org/10.1234/qm2021.

#### APA

Baird, I. G. (2020). Rise of the Brao: Ethnic Minorities in Northeastern Cambodia during Vietnamese Occupation. University of Wisconsin Press.

Dorkenoo, K., & Res, P. (2025). On The Production of Climate-related Loss: Land Dispossession, Indebtedness, and Climate Change in Northeastern Cambodia. The Journal of Peasant Studies, 1–30. https://doi.org/10.1080/03066150.2025.2528861

Ashta, A., Couchoro, M., & Musa, A. S. (2014). Dialectic evolution through the social innovation process: from microcredit to microfinance. Journal of Innovation and Entrepreneurship, 3(1), 4. https://doi.org/10.1186/2192-5372-3-4

PISA 2022 Technical report. (2024). In _Programme for international student assessment/Internationale Schulleistungsstudie_. https://doi.org/10.1787/01820d6d-en

Doe, J. B. (2021). Quantum realities. In J. A. Smith & E. R. Lee (Eds.), Advances in modern physics (pp. 101–125). Oxford University Press. https://doi.org/10.1234/qm2021

#### MLA

Baird, Ian G. Rise of the Brao: Ethnic Minorities in Northeastern Cambodia during Vietnamese Occupation. University of Wisconsin Press, 2020.

Dorkenoo, Kelly, and Phasy Res. “On The Production of Climate-related Loss: Land Dispossession, Indebtedness, and Climate Change in Northeastern Cambodia.” The Journal of Peasant Studies, Aug. 2025, pp. 1–30. https://doi.org/10.1080/03066150.2025.2528861.

Ashta, Arvind, et al. “Dialectic evolution through the social innovation process: from microcredit to microfinance.” Journal of Innovation and Entrepreneurship, vol. 3, no. 1, Jan. 2014, p. 4. https://doi.org/10.1186/2192-5372-3-4.

“PISA 2022 Technical report.” _Programme for international student assessment/Internationale Schulleistungsstudie_, 2024, https://doi.org/10.1787/01820d6d-en.

Doe, Jane B. "Quantum Realities." Advances in Modern Physics, edited by John A. Smith and Emily R. Lee, Oxford University Press, 2021, pp. 101-125. https://doi.org/10.1234/qm2021.
