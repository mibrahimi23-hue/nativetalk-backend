"""add_missing_user_columns

Revision ID: 9fdb7437cc3b
Revises: 001
Create Date: 2026-05-07 12:50:30.695543

Adds the four columns that were added to the User model after the initial
schema migration: timezone, profile_photo, phone, is_suspended.
profile_picture (old name) is left in place so existing data isn't lost.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '9fdb7437cc3b'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('timezone',     sa.String(length=60),  nullable=True, server_default='UTC'))
    op.add_column('users', sa.Column('profile_photo', sa.Text(),             nullable=True))
    op.add_column('users', sa.Column('phone',         sa.String(length=20),  nullable=True))
    op.add_column('users', sa.Column('is_suspended',  sa.Boolean(),           nullable=True, server_default='false'))


def downgrade() -> None:
    op.drop_column('users', 'is_suspended')
    op.drop_column('users', 'phone')
    op.drop_column('users', 'profile_photo')
    op.drop_column('users', 'timezone')
