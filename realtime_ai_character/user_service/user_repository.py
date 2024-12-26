from sqlalchemy.orm import Session
from ..models.user import User 

class UserRepository:
    @staticmethod
    def find_by_address(db: Session, address: str) -> User:
        """
        Поиск пользователя с заданным адресом в базе данных.
        
        :param db: Сессия базы данных
        :param address: Адрес пользователя для поиска
        :return: User
        """
        return db.query(User).filter_by(address=address).first()
    
    @staticmethod
    def save_user(db: Session, user: User) -> User:
        """
        Сохраняет пользователя в базе данных.
        
        :param db: Сессия базы данных
        :param user: Объект пользователя для сохранения
        :return: Сохраненный объект пользователя
        """
        db.add(user)
        db.commit()
        db.refresh(user)
        return user